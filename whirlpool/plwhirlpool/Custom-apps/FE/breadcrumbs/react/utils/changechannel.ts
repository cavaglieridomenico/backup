const API="/api/sessions";

const body = { public:
        { sc:
            {value:"1"}
        }
    };

export async function changeChannel (newChannel: string) : Promise<any> {
    body.public.sc.value=newChannel;
    return fetch(API, {
        method: 'POST',
        credentials: 'same-origin',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
}