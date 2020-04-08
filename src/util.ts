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
