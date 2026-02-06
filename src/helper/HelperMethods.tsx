import type { AxiosError, AxiosResponse } from "axios";
import type { BaseResponse } from "../dto/Response";
import { toast } from "react-toastify";

export function HandleApiErrors(error: AxiosError<BaseResponse>)
{
    if (error.response === undefined || error.response.status === 500) {
      toast.error('Server Error'); return;
    }
    if (error.response.status === 404) {
      toast.error('Resourse not found'); return;
    }
    if (error.response.status === 403) {
      toast.warn('Permission Denied'); return;
    }
    if (error.response.status === 400) {
      error.response.data.errors.forEach( (value) => {
        toast.error(value.errorMessage);
      });
      error.response.data.warnings.forEach( (value) => {
        toast.warn(value);
      });
      return;
    }
}

export function HandleApiSuccess<T extends BaseResponse>(response: AxiosResponse<T>) {
    response.data.warnings.forEach( (value) => {
        toast.warn(value);
    });
    return response.data;
}