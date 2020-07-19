
import { AxiosRequestConfig } from 'axios';

import axios from 'axios-observable';

const config: AxiosRequestConfig = {
    headers: {
        "Content-Type": "application/json",
    }
};
export const http = axios.create(config);

