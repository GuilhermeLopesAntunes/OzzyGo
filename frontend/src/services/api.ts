import axios, {type AxiosError, type InternalAxiosRequestConfig} from 'axios';

//Variaveis para cotnrole da fila de refresh
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: any) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else if(token) {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};


export const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,

    withCredentials: true
})


api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('@OzzyGo:accessToken')

        if(token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

//Volta
api.interceptors.response.use(
    (response) => {
        return response
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {_retry?: boolean}

        if(error.response?.status === 401 && !originalRequest._retry) {
            if (originalRequest.url?.includes('/auth/login')) {
                return Promise.reject(error);
            }
            if (originalRequest.url?.includes('/auth/refresh')) {
                localStorage.removeItem('@OzzyGo:accessToken');
                window.location.href = '/entrar'; 
                return Promise.reject(error);
            }
            originalRequest._retry = true;

            if (isRefreshing) {
                    // Se já tem um refresh acontecendo, enfileira essa requisição
                    return new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
                }    
            isRefreshing = true;

            try {
                
                const { data } = await api.post('/auth/refresh');
                
             
                const newAccessToken = data.acessToken; 
                localStorage.setItem('@OzzyGo:accessToken', newAccessToken);

                api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

         
                processQueue(null, newAccessToken);

          
                return api(originalRequest);
                
            } catch (err) {
                processQueue(err as AxiosError, null);
                localStorage.removeItem('@OzzyGo:accessToken');
                window.location.href = '/entrar';
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }

)