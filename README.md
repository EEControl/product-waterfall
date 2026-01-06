# Alibaba / 1688 Product Waterfall Demo

This project demonstrates a **product waterfall interface** for Alibaba and 1688 platforms, including images and videos. Built with **Node.js (Express)** and vanilla HTML/JS.

It is open-source for showcasing **technical skills** and can serve as a prototype for **product media management** or **data visualization** projects.

## 🎬 Demo Video
https://github.com/user-attachments/assets/971fee4b-7250-4244-97bd-d705b71c1d68

---

## Features

- Responsive **waterfall product grid**
- Display product **images and videos**
- Filter products with **video-only toggle**
- Download product media as **ZIP**
- Track **download counts**
- Support multiple **data sources** (Alibaba, 1688)
- Proxy images for **cross-origin display**

---

## Tech Stack

- Node.js + Express
- Axios (HTTP requests)
- Archiver (ZIP packaging)
- Vanilla JS / HTML / CSS

---

## Project Structure

server/
    app.js
    routes/
    utils/
    data_alibaba/
    data_1688/
public/
    index.html
    css/
    js/
.env
package.json
README.md

## Installation

```bash
git clone <repo_url>
cd product-waterfall
npm install
node server/app.js

## Usage

Open http://localhost:66 in your browser.

Select a source (Alibaba / 1688)

Pick a date to load products

Toggle video-only view

Download product media as ZIP

Check download counts

