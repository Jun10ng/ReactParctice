
function TokenValidte():boolean {
  let rst = localStorage.getItem("token")?true:false
  return rst
}

export {TokenValidte}
