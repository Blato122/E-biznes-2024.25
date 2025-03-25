// https://ktor.io/docs/server-dependencies.html#plugin-dependencies
// https://ktor.io/docs/server-serialization.html#add_content_negotiation_dependency
// https://central.sonatype.com/artifact/dev.kord/kord-core
// https://mvnrepository.com/artifact/ch.qos.logback/logback-classic

val ktor_version: String by project
val kord_version: String by project
val logback_version: String by project

plugins {
    kotlin("jvm") version "1.9.22"
    kotlin("plugin.serialization") version "1.9.22"
    id("io.ktor.plugin") version "2.3.7"
    id("com.github.johnrengelman.shadow") version "8.1.1"
}

application {
    mainClass.set("ApplicationKt")
}

tasks.shadowJar {
    manifest {
        attributes["Main-Class"] = "ApplicationKt"
    }
    mergeServiceFiles()
}

tasks.jar {
    manifest {
        attributes["Main-Class"] = "ApplicationKt"
    }
    
    duplicatesStrategy = DuplicatesStrategy.EXCLUDE
    
    from(sourceSets.main.get().output)
    dependsOn(configurations.runtimeClasspath)
    from({
        configurations.runtimeClasspath.get().filter { it.name.endsWith("jar") }.map { zipTree(it) }
    })
}

repositories {
    mavenCentral()
    jcenter()
    google()
}

// -jvm?
dependencies {
    implementation("io.ktor:ktor-server-core:$ktor_version")
    implementation("io.ktor:ktor-server-netty:$ktor_version")
    implementation("io.ktor:ktor-server-content-negotiation:$ktor_version")
    implementation("io.ktor:ktor-serialization-kotlinx-json:$ktor_version")
    
    // discord API wrapper
    implementation("dev.kord:kord-core:$kord_version")
    
    // logging
    implementation("ch.qos.logback:logback-classic:$logback_version")

    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.5.1")
}