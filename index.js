

import { SwaggerUIBundle, SwaggerUIStandalonePreset } from "swagger-ui-dist"

const swaggerUiAssetPath = require("swagger-ui-dist").getAbsoluteFSPath()
 
import SwaggerUI from "swagger-ui-react"
import "swagger-ui-react/swagger-ui.css"
 
export default App = () => <SwaggerUI url="https://petstore.swagger.io/v2/swagger.json" />