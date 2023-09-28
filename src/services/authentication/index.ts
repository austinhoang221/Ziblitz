import Endpoint from "../../app/api/endpoint";
import { IAuthentication } from "../../app/models/IAuthentication";

export class AuthenticationService {
    public static getVirtualMachines: (model: any) => Promise<any> = model =>
    send(`${Endpoint.login}`, "POST", model).then((data: any) => data);
}