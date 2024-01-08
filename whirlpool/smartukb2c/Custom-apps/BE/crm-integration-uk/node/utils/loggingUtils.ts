export default function logMessage(message: string): string
{
  return (new Date).getUTCFullYear()+'-'+
  ((new Date).getUTCMonth()+1)+'-'+
  (new Date).getUTCDate()+"T"+
  (new Date()).getUTCHours()+
  ":"+(new Date()).getUTCMinutes()+
  ":"+(new Date()).getUTCSeconds()+
  "."+(new Date).getUTCMilliseconds()+"Z - "+
  message
}