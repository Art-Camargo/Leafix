#include "esp_camera.h"
#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid = "Artur 2.4G";
const char* password = "artur2501";

const char* serverName = "https://plantex-server.onrender.com/upload";

SemaphoreHandle_t takePhotoSemaphore = NULL;
SemaphoreHandle_t sendPhotoSemaphore = NULL;

camera_fb_t* fb = NULL;

sendPhotoSemaphore = xSemaphoreCreateBinary();
takePhotoSemaphore = xSemaphoreCreateBinary();

const TickType_t xDelay   = 10 * 60 * 1000; 

// Configurações da câmera
#define PWDN_GPIO_NUM     32
#define RESET_GPIO_NUM    -1
#define XCLK_GPIO_NUM      0
#define SIOD_GPIO_NUM     26
#define SIOC_GPIO_NUM     27
#define Y9_GPIO_NUM       35
#define Y8_GPIO_NUM       34
#define Y7_GPIO_NUM       39
#define Y6_GPIO_NUM       36
#define Y5_GPIO_NUM       21
#define Y4_GPIO_NUM       19
#define Y3_GPIO_NUM       18
#define Y2_GPIO_NUM        5
#define VSYNC_GPIO_NUM    25
#define HREF_GPIO_NUM     23
#define PCLK_GPIO_NUM     22

void sendPhotoToServer(camera_fb_t* fb) {
  if (WiFi.status() == WL_CONNECTED && fb != NULL) {
    HTTPClient http;
    http.begin(serverName);
    http.addHeader("Content-Type", "application/octet-stream");
    int httpResponseCode = http.POST(fb->buf, fb->len);

    if (httpResponseCode > 0) {
      Serial.println("Foto enviada!");
      Serial.println(http.getString());
    } else {
      Serial.print("Erro ao enviar. Código: ");
      Serial.println(httpResponseCode);
    }
    http.end();
  } else {
    Serial.println("WiFi desconectado ou fb nulo!");
  }
}

void capturePhotoTask(void * parameter) {
  while (1) {
    if (xSemaphoreTake(takePhotoSemaphore, portMAX_DELAY) == pdTRUE) {
      fb = esp_camera_fb_get();
      if (fb) {
        Serial.println("Foto capturada.");
        xSemaphoreGive(sendPhotoSemaphore); 
      } else {
        Serial.println("Falha ao capturar foto.");
      } 
    }
  }
}

void sendPhotoTask(void * parameter) {
  while (1) {
    if (xSemaphoreTake(sendPhotoSemaphore);, portMAX_DELAY) == pdTRUE) {
      sendPhotoToServer(fb);
      esp_camera_fb_return(fb); 
      fb = NULL;
      Serial.println("Buffer liberado.");
      vTaskDelay(xDelay);
      xSempahoreGive(takePhotoSemaphore);
    }
  }
}

void setup() {
  Serial.begin(115200);

  WiFi.begin(ssid, password);
  Serial.print("Conectando WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println();
  Serial.println("WiFi conectado");
  Serial.println(WiFi.localIP());

  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = Y2_GPIO_NUM;
  config.pin_d1 = Y3_GPIO_NUM;
  config.pin_d2 = Y4_GPIO_NUM;
  config.pin_d3 = Y5_GPIO_NUM;
  config.pin_d4 = Y6_GPIO_NUM;
  config.pin_d5 = Y7_GPIO_NUM;
  config.pin_d6 = Y8_GPIO_NUM;
  config.pin_d7 = Y9_GPIO_NUM;
  config.pin_xclk = XCLK_GPIO_NUM;
  config.pin_pclk = PCLK_GPIO_NUM;
  config.pin_vsync = VSYNC_GPIO_NUM;
  config.pin_href = HREF_GPIO_NUM;
  config.pin_sscb_sda = SIOD_GPIO_NUM;
  config.pin_sscb_scl = SIOC_GPIO_NUM;
  config.pin_pwdn = PWDN_GPIO_NUM;
  config.pin_reset = RESET_GPIO_NUM;
  config.xclk_freq_hz = 20000000;
  config.pixel_format = PIXFORMAT_JPEG;

  if (psramFound()) {
    config.frame_size = FRAMESIZE_UXGA;
    config.jpeg_quality = 10;
    config.fb_count = 2;
  } else {
    config.frame_size = FRAMESIZE_SVGA;
    config.jpeg_quality = 12;
    config.fb_count = 1;
  }

  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
    Serial.printf("Erro ao inicializar a câmera: 0x%x", err);
    return;
  }

  xSemaphoreGive(takePhotoSemaphore); 

  xTaskCreatePinnedToCore(
    capturePhotoTask,   // Função da tarefa
    "CapturePhoto",     // Nome da tarefa
    10000,              // Stack size
    NULL,               // Parâmetro
    1,                  // Prioridade
    NULL,               // Handle da tarefa
    1                   // Core 1
  );

  xTaskCreatePinnedToCore(
    sendPhotoTask,
    "SendPhoto",
    10000,
    NULL,
    1,
    NULL,
    1
  );
}

void loop() {
  
}
