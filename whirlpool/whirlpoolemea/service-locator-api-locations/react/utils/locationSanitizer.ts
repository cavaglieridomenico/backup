







export default function locationSanitizer(stringToSanitize:string)
{
    let newString = stringToSanitize
    .replace(/-/g, " ")
    .replace(/%20/g, " ")
    .replace(/%0A/g,"")
    .replace(/%C3%AC/g,"ì")
    .replace(/%C3%B2/g,"ò")
    .replace(/%C3%B9/g,"ù")
    .replace(/%C3%A9/g,"é")
    .replace(/%C3%A8/g,"è")
    .replace(/%C3%B4/g,"ô")
    .replace(/%C3%A0/g, "à")

    return newString
}