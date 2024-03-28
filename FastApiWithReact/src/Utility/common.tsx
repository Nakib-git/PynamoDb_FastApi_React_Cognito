import moment from 'moment';

export const API_URL = 'http://127.0.0.1:8000';

interface TableCellDateTimeProps {
  datetime: Date | undefined;
}
export const TableCellDateTime = (prop: TableCellDateTimeProps) => {
  const datetime = moment(prop.datetime);
  // Format the datetime as desired
  const formattedDatetime = datetime.format('YYYY-MM-DD HH:mm:ss');
  if (!prop.datetime) return (<td></td>)
  return (<td>{formattedDatetime}</td>
  );
}
// const convertPropertyNamesToLowerCase = (list: any[]): any[] => {
//   return list.map(item => {
//     const newItem: any = {};
//     for (const key in item) {
//       if (Object.prototype.hasOwnProperty.call(item, key)) {
//         const newKey = key.charAt(0).toLowerCase() + key.slice(1);
//         newItem[newKey] = item[key];
//       }
//     }
//     return newItem;
//   });
// };

export const decodeToken = (token: string): any | null => {
  const base64Url = token.split('.')[1];
  if (!base64Url) {
    console.error('Invalid token format');
    return null;
  }
  try {
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decodedToken = JSON.parse(atob(base64));
    return decodedToken;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}