window.Array.prototype.findLastIndex = function findLastIndex(predicate) {
  let l = this.length;
  while (l--) {
    if (predicate(this[l], l, this)) {
      return l;
    }
  }
  return -1;
}
