import dev.kord.common.entity.Snowflake
import dev.kord.core.Kord
import dev.kord.core.event.message.MessageCreateEvent
import dev.kord.core.on
import dev.kord.gateway.Intent
import dev.kord.gateway.PrivilegedIntent
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import kotlinx.serialization.builtins.ListSerializer
import kotlinx.serialization.serializer
import java.util.Properties

@Serializable
data class Product(val name: String, val category: String, val price: Int)

suspend fun main() {
    val config = Properties().apply {
        val configFile = Application::class.java.getResourceAsStream("/config.properties")
        if (configFile != null) {
            load(configFile)
        }
    }

    val token = config.getProperty("discord.token") 
        ?: System.getenv("DISCORD_TOKEN") 
        ?: throw IllegalStateException("Discord token not found")

    val channelId = config.getProperty("discord.channel") 
        ?: System.getenv("DISCORD_CHANNEL") 
        ?: throw IllegalStateException("Discord channel not found")

    val discordBot = Kord(token)

    val categories = listOf("excursion", "equipment", "clothes")
    val products = listOf(
        Product("Mount Kazbek", "excursion", 3000),
        Product("Gerlach", "excursion", 500),
        Product("Mont Blanc", "excursion", 5000),
        Product("Ice axe", "equipment", 250),
        Product("Crampons", "equipment", 250),
        Product("Mountaineering boots", "equipment", 1500),
        Product("Waterproof jacket", "clothes", 900),
        Product("Down jacket", "clothes", 800)
    )

    // event listener for incoming Discord messages
    discordBot.on<MessageCreateEvent> {
        // ignore messages from bots to prevent loops
        if (message.author?.isBot != false) return@on

        // handle commands that start with !
        if (message.content.startsWith('!')) {
            val command = message.content.substringAfter('!')

            when (command) {
                // return list of categories
                "categories" -> {
                    message.channel.createMessage(Json.encodeToString(categories))
                }
                // return filtered products
                in categories -> {
                    val filteredProducts = products.filter { it.category == command }
                    message.channel.createMessage(Json.encodeToString(filteredProducts))
                }
                // handle unknown commands
                else -> {
                    message.channel.createMessage("Unknown command. Try !categories or !excursion")
                }
            }
        }

        // log received messages
        println("Message from ${message.author?.tag}: ${message.content}")
    }

    // start Ktor server for REST API
    embeddedServer(Netty, port = 8080) {
        setupMessageAPI(discordBot, channelId)
    }.start(wait = false)

    // connect to Discord with necessary permissions
    discordBot.login {
        @OptIn(PrivilegedIntent::class)
        intents += Intent.MessageContent
    }
}

// Ktor module for sending messages via HTTP
fun Application.setupMessageAPI(discordBot: Kord, channelId: String) {
    routing {
        post("/send") {
            val message = call.receive<String>()
            discordBot.rest.channel.createMessage(Snowflake(channelId)) {
                content = message
            }
            call.respond("Message sent successfully to Discord")
        }
    }
}