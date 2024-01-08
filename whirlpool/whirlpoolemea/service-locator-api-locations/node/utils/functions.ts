export const normalizeChars = (str: string) =>
    str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');


export const handleSpecialChars = (obj: { province?: string; region?: string, city?: string }) => {
    obj.province = obj.province && normalizeChars(obj.province);
    obj.region = obj.region && normalizeChars(obj.region);
    obj.city = obj.city && normalizeChars(obj.city);
    return obj;
};
