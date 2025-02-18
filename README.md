<div align="center">
   <img src="https://github.com/underscoresolana/underscore_backend/blob/release/banner.png" alt="drawing" width="1200"/>

   _An AI and data-powered web3 analysis powerhouse. Try our [Price Dynamics Dashboard](https://app.underscorelabs.dev/)._
   
   [![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/yourusername/under__score/actions)
   [![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
   [![Visit My Website](https://img.shields.io/badge/Website-Visit-blue.svg)](https://underscorelabs.dev/)
   [![X](https://img.shields.io/badge/Twitter-@underscore_labs-1DA1F2.svg)](https://x.com/underscore_labs)

</div>

## Table of Contents
- [Overview](#overview)
- [Installation](#installation)
- [Usage](#usage)
- [Entrypoint and Configurations](#entrypoint-and-configurations)
- [Contributing](#contributing)
- [License](#license)

---

## Overview
UNDER_SCORE is an tool leveraging autonomous web agents, quantitative pricing models and reasoning language models to deliver the most intricate analytical insights on Solana.
The product is under active development with alpha release scheduled in Feb 2025. This repository contains backend code for UNDER_SCORE web application.

<img src="https://i.postimg.cc/q7f6xfQ4/scory-removebg-preview.png" alt="drawing" width="100"/>  `> gm `

---

## Features

- **Under_scoring**: a token scoring module integrating several factors, such as Fundamentals, Community, Price Action.
- **Market overview**: reports on similar tokens and projects for the most informed bids on the current meta.
- **APM**: A proprietary quantitative factor pricing model, enabling fast detection of trends and deep analysis of token performance w.r.t the market.

--- 

## Installation
1. Clone the repository:

   ```bash
   git clone https://github.com/underscoresolana/underscore_backend.git
   cd under__score
   ```

2. Create a virtual environment and install Python dependencies:

   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

3. Copy and rename `.env.template` to `.env` and adjust it with your secrets and environment parameters.

---

## Usage
1. **Build Docker Containers**  
   Use the included Dockerfiles or docker-compose setup. For example:

   ```bash
   docker-compose build
   docker-compose up
   ```

2. **Run the Application**  
   The main entrypoint is defined in `Makefile` and Docker configurations. `make run` or `python -m src.api` can be used to launch the API server locally.

3. **Tests**  
   Run all tests:

   ```bash
   pytest --maxfail=1 --disable-warnings
   ```

---

## Entrypoint and Configurations
- **Entrypoint**  
  By default, `analysis_routes.py` powers the analysis endpoints. For container deployments, the Dockerfiles define the executables.

- **LLM Configurations and API Keys**  
  Place your LLM settings in `configs/model_configs/llm_settings.yaml`. API keys and tokens should be stored in your environment files (`dev.env`, `test.env`, `prod.env`) or in a `.env` file outside version control.

- **Using API endpoints**
  Once started, the server will be listening at port 8080. The configured endpoints are listed in `docs/api/swagger.yaml`.

---

## Contributing
Create a feature branch, add your changes, and open a pull request. We welcome additional features, connectors and many more.

---

## License
This project is licensed under the [MIT License](LICENSE).

--- 

<img src="https://i.postimg.cc/K8jDHynT/photo-2025-02-04-00-21-50.jpg" alt="drawing" width="1000"/>

Contact us at earl@underscorelabs.dev for any inquiries.
