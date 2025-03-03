import admin from "firebase-admin"

import serviceAccount from "../../secrets/phantom-c58f1-firebase-adminsdk-fbsvc-3481399cbe.json"

admin.initializeApp({
    credential:admin.credential.cert(serviceAccount as admin.ServiceAccount)

})

export default admin