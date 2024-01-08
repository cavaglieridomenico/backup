import dns from 'dns'

export async function ValidateNotification(ip: string): Promise<any> {
    return new Promise((resolve, reject) => {
        dns.reverse(ip, (err, hostNames) => {
            if (err == null) {
                hostNames.forEach(hostname => {
                    if(!/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+worldpay\.com$/g.test(hostname))
                        reject(hostname + " is not a valid domain")
                })
                resolve(hostNames)
            } else{
                reject(err)
            }
        })
    })
}