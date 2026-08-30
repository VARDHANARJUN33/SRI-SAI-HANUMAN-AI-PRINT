// ========================================
// SRI SAI HANUMAN AI PHOTO PRINT
// ========================================


// ========================================
// n8n WEBHOOK
// ========================================

const N8N_WEBHOOK_URL =
    "https://cricwith27.app.n8n.cloud/webhook/photo-upload";


// ========================================
// CREATE PHOTO INPUT
// ========================================

const photoInput = document.createElement("input");

photoInput.type = "file";
photoInput.accept = "image/*";
photoInput.style.display = "none";

document.body.appendChild(photoInput);


// ========================================
// FIND UPLOAD BUTTON
// ========================================

const uploadButtons = document.querySelectorAll(".action-card");

uploadButtons.forEach((button) => {

    const title = button.querySelector("h3");

    if (!title) return;

    if (title.textContent.trim() === "Upload Photo") {

        button.addEventListener("click", () => {

            photoInput.value = "";

            photoInput.click();

        });

    }

});


// ========================================
// PHOTO SELECTED
// ========================================

photoInput.addEventListener("change", () => {

    const file = photoInput.files[0];

    if (!file) return;


    // ----------------------------------------
    // Create temporary image URL
    // ----------------------------------------

    const imageURL = URL.createObjectURL(file);


    // ----------------------------------------
    // Preview Background
    // ----------------------------------------

    const preview = document.createElement("div");

    preview.style.position = "fixed";
    preview.style.inset = "0";
    preview.style.background = "rgba(0,0,0,0.92)";
    preview.style.zIndex = "9999";

    preview.style.display = "flex";
    preview.style.flexDirection = "column";
    preview.style.alignItems = "center";
    preview.style.justifyContent = "center";

    preview.style.padding = "20px";


    // ----------------------------------------
    // Image
    // ----------------------------------------

    const image = document.createElement("img");

    image.src = imageURL;

    image.style.maxWidth = "90%";
    image.style.maxHeight = "65vh";

    image.style.objectFit = "contain";

    image.style.borderRadius = "15px";


    // ----------------------------------------
    // File Name
    // ----------------------------------------

    const fileName = document.createElement("p");

    fileName.textContent = file.name;

    fileName.style.color = "white";
    fileName.style.marginTop = "15px";

    fileName.style.fontSize = "14px";


    // ----------------------------------------
    // Processing Message
    // ----------------------------------------

    const message = document.createElement("p");

    message.textContent =
        "🤖 Ready for AI processing";

    message.style.color = "#d6ad55";

    message.style.marginTop = "10px";

    message.style.fontWeight = "bold";


    // ========================================
    // PROCESS PHOTO BUTTON
    // ========================================

    const processButton =
        document.createElement("button");

    processButton.textContent =
        "🤖 Process Photo";

    processButton.style.marginTop = "20px";

    processButton.style.padding =
        "13px 25px";

    processButton.style.border = "none";

    processButton.style.borderRadius =
        "10px";

    processButton.style.cursor =
        "pointer";

    processButton.style.fontWeight =
        "bold";

    processButton.style.background =
        "#d6ad55";

    processButton.style.color =
        "#10130f";


    // ========================================
    // PRINT PHOTO BUTTON
    // ========================================

    const printButton =
        document.createElement("button");

    printButton.textContent =
        "🖨️ Print Photo";

    printButton.style.marginTop =
        "12px";

    printButton.style.padding =
        "13px 25px";

    printButton.style.border =
        "none";

    printButton.style.borderRadius =
        "10px";

    printButton.style.cursor =
        "pointer";

    printButton.style.fontWeight =
        "bold";

    printButton.style.background =
        "#ffffff";

    printButton.style.color =
        "#10130f";

    printButton.style.display =
        "none";


    // ========================================
    // PRINT PROCESSED PHOTO
    // ========================================

    printButton.addEventListener(
        "click",
        () => {

            const printWindow =
                window.open("", "_blank");

            if (!printWindow) {

                alert(
                    "Please allow pop-ups to print the photo."
                );

                return;

            }

            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Print Photo</title>

                    <style>

                        @page {
                            margin: 0;
                        }

                        html,
                        body {
                            margin: 0;
                            padding: 0;
                            background: white;
                        }

                        img {
                            display: block;
                            width: 100%;
                            height: auto;
                        }

                    </style>

                </head>

                <body>

                    <img src="${image.src}">

                </body>

                </html>
            `);

            printWindow.document.close();

            printWindow.onload = () => {

                printWindow.focus();

                printWindow.print();

            };

        }
    );


    // ========================================
    // SEND PHOTO TO n8n
    // ========================================

    processButton.addEventListener(
        "click",
        async () => {

            processButton.textContent =
                "🤖 Sending to AI...";

            processButton.disabled = true;

            message.textContent =
                "📤 Sending photo to n8n...";


            try {

                // Create form data
                const formData =
                    new FormData();

                // Add photo
                formData.append(
                    "photo",
                    file
                );


                // Send to n8n
                const response =
                    await fetch(
                        N8N_WEBHOOK_URL,
                        {
                            method: "POST",
                            body: formData
                        }
                    );


                // Check response
                if (!response.ok) {

                    throw new Error(
                        "n8n returned an error"
                    );

                }


                // ========================================
                // RECEIVE PROCESSED PHOTO FROM n8n
                // ========================================

                const processedBlob =
                    await response.blob();

                const processedImageURL =
                    URL.createObjectURL(
                        processedBlob
                    );


                // Show processed image
                image.src =
                    processedImageURL;


                // Update message
                message.textContent =
                    "✅ Photo processed successfully!";


                // Update button
                processButton.textContent =
                    "✅ Processing Complete";


                // Show print button
                printButton.style.display =
                    "block";


                // Keep reference for cleanup
                image.dataset.processedUrl =
                    processedImageURL;


                console.log(
                    "Processed photo received from n8n"
                );


            } catch (error) {

                console.error(error);


                message.textContent =
                    "❌ Could not connect to n8n.";


                processButton.textContent =
                    "🔄 Try Again";

                processButton.disabled =
                    false;

            }

        }
    );


    // ========================================
    // CLOSE BUTTON
    // ========================================

    const closeButton =
        document.createElement("button");

    closeButton.textContent =
        "Close";

    closeButton.style.marginTop =
        "20px";

    closeButton.style.padding =
        "12px 25px";

    closeButton.style.border =
        "none";

    closeButton.style.borderRadius =
        "10px";

    closeButton.style.cursor =
        "pointer";

    closeButton.style.fontWeight =
        "bold";


    closeButton.addEventListener(
        "click",
        () => {

            URL.revokeObjectURL(
                imageURL
            );

            if (
                image.dataset.processedUrl
            ) {

                URL.revokeObjectURL(
                    image.dataset.processedUrl
                );

            }

            preview.remove();

        }
    );


    // ========================================
    // ADD EVERYTHING TO PREVIEW
    // ========================================

    preview.appendChild(image);

    preview.appendChild(fileName);

    preview.appendChild(message);

    preview.appendChild(processButton);

    preview.appendChild(printButton);

    preview.appendChild(closeButton);


    document.body.appendChild(preview);

});
// ========================================
// COMPLETED SECTION
// ========================================

const completedButton =
    Array.from(document.querySelectorAll(".action-card"))
        .find((button) => {

            const title =
                button.querySelector("h3");

            return title &&
                title.textContent.trim() === "Completed";

        });


const completedSection =
    document.getElementById("completedSection");


if (completedButton && completedSection) {

    completedButton.addEventListener(
        "click",
        () => {

            // Hide dashboard sections
            document.querySelector(".welcome").style.display = "none";
            document.querySelector(".stats").style.display = "none";
            document.querySelector(".main-actions").style.display = "none";
            document.querySelector(".printer-card").style.display = "none";
            document.querySelector(".recent").style.display = "none";

            // Show Completed section
            completedSection.style.display = "block";

            // Scroll to Completed section
            completedSection.scrollIntoView({
                behavior: "smooth"
            });

        }
    );

}
// ========================================
// WHATSAPP PHOTOS SECTION
// ========================================

const whatsappButton =
    Array.from(document.querySelectorAll(".action-card"))
        .find((button) => {

            const title =
                button.querySelector("h3");

            return title &&
                title.textContent.trim() === "WhatsApp Photos";

        });


const whatsappSection =
    document.getElementById("whatsappSection");


if (whatsappButton && whatsappSection) {

    whatsappButton.addEventListener(
        "click",
        () => {

            // Hide dashboard sections
            document.querySelector(".welcome").style.display = "none";
            document.querySelector(".stats").style.display = "none";
            document.querySelector(".main-actions").style.display = "none";
            document.querySelector(".printer-card").style.display = "none";
            document.querySelector(".recent").style.display = "none";
            document.getElementById("completedSection").style.display = "none";

            // Show WhatsApp section
            whatsappSection.style.display = "block";

            // Scroll to WhatsApp section
            whatsappSection.scrollIntoView({
                behavior: "smooth"
            });

        }
    );

}