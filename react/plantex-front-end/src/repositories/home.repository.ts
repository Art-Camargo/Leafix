import { makeRequest } from "@/http/axios-connector";
import { IPhoto } from "@/types/home";

export interface TableDataParams {
  page: number;
  limit: number;
  startDate?: Date | string;
  endDate?: Date | string;
}

export interface ITableDataResponse {
  photos: IPhoto[];
  total: number;
  minId: number;
  page: number;
}

export default class HomeRepository {
  static async getTableData(
    params: TableDataParams
  ): Promise<ITableDataResponse> {
    const response = await makeRequest({
      method: "GET",
      url: "find-photos",
      params,
    });

    if (response.isErr())
      return {
        photos: [],
        total: 0,
        minId: 0,
        page: 1,
      } as ITableDataResponse;

    return response.data as ITableDataResponse;
  }
}
