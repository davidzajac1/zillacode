package sparklambda

import java.util.{ Map => JavaMap }
import com.amazonaws.lambda.thirdparty.com.google.gson.GsonBuilder
import com.amazonaws.services.lambda.runtime.{Context, RequestHandler}

import scala.tools.reflect.ToolBox
import scala.reflect.runtime.universe

class LambdaHandler() extends RequestHandler[JavaMap[String, String], String] {
  val gson = new GsonBuilder().setPrettyPrinting.create

  override def handleRequest(event: JavaMap[String, String], context: Context): String = {
    val logger = context.getLogger
    
    logger.log(s"EVENT: ${gson.toJson(event)}\n")

  val toolbox = universe.runtimeMirror(getClass.getClassLoader).mkToolBox(
    options = "-Xlog-implicits -Vimplicits" 
  )

  val to_return = toolbox.eval(toolbox.parse(event.get("to_run"))).asInstanceOf[String]

  to_return

  }
}
