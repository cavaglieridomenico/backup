export class CostaResponse {
    access_token: string;
    token_type:string;
    expires_in:number;
    scope:string;
    soap_instance_url:string;
    rest_instance_url:string;

    constructor(access_token: string, token_type: string, expires_in: number, scope: string, soap_instance_url: string, rest_instance_url: string) {
        this.access_token = access_token;
        this.token_type = token_type;
        this.expires_in = expires_in;
        this.scope = scope;
        this.soap_instance_url = soap_instance_url;
        this.rest_instance_url = rest_instance_url;
    }
}
