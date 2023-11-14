const jwt = require("jsonwebtoken");
const express = require("express");

export function authorize(...roles) {
  return function (req, res, next) {
    if (!req.headers.authorization) {
      return res.status(401).end();
    }

    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      req.user = { role: Roles.Guest };
      return next();
    }

    // try {
    // 	req.user = jwt.verify(token, JWT_PRIVATE_KEY!) as unknown as User;
    // } catch (error) {
    // 	throw new UserError('Invalid token.');
    // }
    next();

    // for (const roleOrPermission of rolesOrPermissions) {
    // 	if (Object.values(Roles).includes(roleOrPermission as Roles))
    // 		if (roleOrPermission == req.user!.role) return next()
    // 	else if (req.user!.permissions?.includes(roleOrPermission as Permission))
    // 		return next()
    // }

    throw new UnauthorizedError(`Access denied. You cannot access this route`);
  };
}
