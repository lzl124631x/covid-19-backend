import { Entry } from "./type";

export function forOwn<T>(
  obj: { [key: string]: T },
  iteratee: (val: T, key: string) => void
) {
  Object.keys(obj).forEach((key) => {
    iteratee(obj[key], key);
  });
}

export function mapOwn<T>(
  obj: { [key: string]: T },
  iteratee: (val: T, key: string) => any
) {
  let arr: any[] = [];
  forOwn(obj, (val, key) => {
    arr.push(iteratee(val, key));
  });
  return arr;
}

export function mapMap<T, V>(
  map: Map<string, T>,
  iteratee: (value: T, key: string) => V
) {
  let ans: V[] = [];
  map.forEach((val, key) => {
    ans.push(iteratee(val, key));
  });
  return ans;
}
