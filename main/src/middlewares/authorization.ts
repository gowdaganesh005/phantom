import  admin from "./firebaseAdmin";

export const authorization = async (req:any, res:any, next:any) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // Attach user data to request
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};


