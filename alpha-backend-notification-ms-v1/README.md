# 📬 Alpha Notification Microservice v1

Welcome to the **Alpha Notification Microservice** 🌐. This pivotal service orchestrates the dispatch of various notifications within the Alpha platform, starting with email notifications 📧 and laying the groundwork for future channels like push notifications and scheduled notifications.

![alpha_software_arch drawio](https://github.com/launchpadapps-au/alpha-backend-notification-ms-1/assets/118795141/e1d27fde-4e77-40d9-b1ec-f7c745211191)

## 🌟 Features

- 📧 **Email Notifications**: Leveraging dynamic templating for personalized messages, initially via SendGrid.
- 🔄 **Event-Driven Notifications**: Utilizing PostgreSQL LISTEN/NOTIFY for instant, real-time notifications.
- 🔗 **Dynamic Email Content**: Integration with Handlebars for customizable email content generation.
- 📅 **Future Plans**: Aiming to expand with scheduled notifications and push notifications via Firebase Cloud Messaging (FCM).

## 🚀 Getting Started

### 📋 Prerequisites

- 🟢 Node.js (version x.x.x)
- 📦 npm or Yarn
- 🗄️ PostgreSQL (for real-time notifications)
- 🌐 SendGrid (for email delivery)

### 🛠️ Installation

**Clone the Repository:**

```bash
git clone https://github.com/alpha-org/alpha-backend-notification-ms-v1.git
cd alpha-backend-notification-ms-v1
```

**Install Dependencies:**

```bash
npm install
```

**Environment Setup:**

Populate a `.env` file in the project root with necessary configurations:

```
Yet to be added
```

### 🏃 Running the Service

Start the service with:

```bash
npm run start
```

This spins up the Notification Microservice, ready to manage and dispatch notifications.


## 🏗️ Architecture

### Event-Driven Notifications

Leverages PostgreSQL's LISTEN/NOTIFY for immediate notification upon event triggers, with a robust email handling mechanism integrated with SendGrid and Handlebars for dynamic content.

### Future Enhancements

Plans to incorporate scheduled notifications and FCM push notifications to provide comprehensive notification support across the platform.

## 🏷️ Versioning

We follow [SemVer](http://semver.org/) for version management. For available versions, see the [tags on this repository](#).
