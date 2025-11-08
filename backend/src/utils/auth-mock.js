
export function mockAuth(req, res, next) {
  req.user = { age: 21 };
  next();
}
