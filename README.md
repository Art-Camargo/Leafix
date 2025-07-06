# Sistema Automatizado de Fotomonitoramento de Plantas com ESP-CAM, Web Server e Google Drive

Este documento descreve o desenvolvimento de um sistema automatizado de fotomonitoramento de plantas utilizando ESP32-CAM, servidor web e Google Drive. O trabalho foi encaminhado ao 11º Siepex, o Salão Integrado de Ensino, Pesquisa e Extensão da Uergs.

## Autores:
* Artur de Camargo (Aluno voluntário, Curso de Engenharia de Computação, Uergs - Guaíba) 
* Celso Maciel da Costa 

## Resumo:
O sistema foi desenvolvido para monitoramento fotográfico de plantas utilizando uma ESP32-CAM configurada com FreeRTOS. O objetivo é capturar imagens em intervalos configuráveis, enviando-as a um servidor web que armazena os dados em um banco de dados e no Google Drive. As imagens são disponibilizadas por meio de uma interface web organizada por data. A metodologia envolveu a integração de hardware embarcado, comunicação via HTTP e estruturação de um backend para armazenamento e visualização. Os testes demonstraram estabilidade na captura e envio das imagens. Conclui-se que o sistema é eficiente para acompanhar o crescimento vegetal ao longo do tempo.

**Palavras-chave:** sistemas embarcados; esp32-cam; freertos.

## 1 INTRODUÇÃO:
O monitoramento do desenvolvimento de plantas é uma prática relevante em projetos de pesquisa, ensino e extensão voltados à agricultura, botânica e sustentabilidade. A utilização de tecnologias embarcadas, como a ESP32-CAM, aliada a sistemas operacionais como o FreeRTOS, permite automatizar a coleta de imagens e otimizar o acompanhamento do crescimento vegetal. Este trabalho teve como objetivo desenvolver um sistema de fotomonitoramento periódico, com envio e armazenamento em nuvem, por meio de uma interface web. A ação envolveu estudantes de graduação, promovendo o aprendizado prático de conceitos relacionados a sistemas operacionais embarcados e à integração entre hardware e software em projetos reais.

## 2 METODOLOGIA:
O desenvolvimento do sistema envolveu estudantes de graduação, com foco no aprendizado prático de sistemas embarcados e operacionais. A metodologia foi dividida em três etapas principais: montagem e configuração do hardware, desenvolvimento do sistema embarcado com FreeRTOS e implementação da interface de visualização em nuvem.

1.  **Montagem e Configuração do Hardware:**
    * Inicialmente, foi utilizada uma placa ESP32-CAM conectada a uma fonte de alimentação dedicada.
    * Para a gravação do firmware e comunicação serial com o computador, foi utilizado um módulo conversor USB-serial (FTDI), fundamental devido à ausência de Porta USB nativa na ESP32-CAM 29].
    * A montagem do circuito foi realizada de forma a garantir estabilidade na captação e transmissão das imagens.

2.  **Desenvolvimento do Sistema Embarcado com FreeRTOS:**
    * O firmware foi desenvolvido utilizando o sistema operacional de tempo real FreeRTOS, com tarefas paralelas controladas por semáforos binários e temporizadores.
    * A lógica foi estruturada para alternar entre as tarefas de captura da imagem e envio dos dados via Wi-Fi, de forma sincronizada.
    * A Figura 1 no documento apresenta um exemplo do controle de tarefas utilizando semáforos para coordenar o fluxo entre a captura e a transmissão.

3.  **Implementação da Interface de Visualização em Nuvem:**
    * Na etapa seguinte, foi implementado um servidor web para recepção das imagens, armazenamento em banco de dados e envio automático para o Google Drive.
    * A integração foi feita por meio de requisições HTTP e scripts de automação.
    * O frontend foi construído com HTML, CSS e JavaScript, permitindo a visualização das imagens por data, de forma responsiva e intuitiva.
    * A Figura 2 no documento ilustra o sistema montado fisicamente, enquanto a Figura 3 mostra a interface web em operação.

## 3 RESULTADOS E DISCUSSÃO:
Durante o desenvolvimento do sistema, foi possível aplicar na prática conhecimentos de sistemas embarcados, redes de comunicação e integração com serviços em nuvem. O sistema implementado mostrou-se funcional e estável, realizando capturas periódicas conforme os intervalos definidos e enviando as imagens com sucesso para o servidor web. A interface de visualização permitiu o acesso intuitivo ao histórico de imagens, organizadas por data, favorecendo o acompanhamento da evolução das plantas de forma sistemática.

Os testes demonstraram que a comunicação entre o dispositivo embarcado e o servidor ocorreu sem perdas significativas de dados, e o uso do FreeRTOS contribuiu para o controle eficiente das tarefas, evitando bloqueios e atrasos na captura e transmissão das imagens. A estrutura modular do firmware permite que ajustes no intervalo de captura e no envio de dados sejam feitos com facilidade.

**Oportunidades de Melhoria Futura:**
* **Ausência de alimentação por baterias:** Um dos pontos identificados como oportunidade de melhoria futura foi a ausência de alimentação por baterias. O protótipo, na versão atual, depende de conexão direta à rede elétrica, o que pode limitar seu uso em ambientes externos ou em locais onde o acesso à energia seja instável. A inclusão de um sistema de alimentação autônoma, por meio de baterias recarregáveis ou painéis solares, pode aumentar a versatilidade da solução.
* **Implementação de um modo de visualização em tempo real (streaming ao vivo):** Outra proposta para evolução do sistema é a implementação de um modo de visualização em tempo real (streaming ao vivo). Atualmente, as imagens são capturadas e disponibilizadas em intervalos pré-definidos. A inclusão de uma funcionalidade live possibilitaria o acompanhamento instantâneo do estado da planta, agregando valor à solução especialmente para fins de monitoramento contínuo em pesquisas ou ensino.

Além da aplicabilidade prática, o desenvolvimento deste projeto proporcionou um aprofundamento significativo em conceitos técnicos e metodológicos. A experiência contribuiu diretamente para a formação acadêmica, ao exigir planejamento, organização, autonomia e tomada de decisões em um contexto real de desenvolvimento de sistemas embarcados com aplicação social relevante.

## 4 CONSIDERAÇÕES FINAIS:
O desenvolvimento do sistema de monitoramento fotográfico com a ESP32-CAM e o uso do FreeRTOS permitiu atingir os objetivos propostos, viabilizando a captura automática de imagens, o envio para um servidor remoto e a visualização por meio de uma interface web organizada. Os testes confirmaram a estabilidade do sistema e sua capacidade para acompanhar o crescimento de plantas de forma contínua. A integração com serviços de nuvem e banco de dados funcionou de maneira eficaz, garantindo o acesso remoto ao histórico das imagens.

Embora o sistema dependa de alimentação elétrica contínua e ainda não ofereça visualização em tempo real, essas limitações não comprometem seu desempenho. Tais pontos representam oportunidades claras de aprimoramento. O projeto também proporcionou um aprofundamento prático em sistemas embarcados, redes e automação, resultando em uma solução acessível e com potencial impacto em contextos de pesquisa, ensino e agricultura sustentável.
