# Database Setup Guide

This project uses **PostgreSQL** running inside a **Docker** container. Follow these steps to set it up and connect to it.

## 1. Start the Database (Docker)

Make sure you have [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

1.  Open your terminal in the project root.
2.  Run the following command to start the database:
    ```bash
    docker-compose up -d
    ```
    *   `-d` stands for "detached" mode, which runs the container in the background.
3.  Verify it's running:
    ```bash
    docker ps
    ```
    You should see a container named `focus-flow-db`.

## 2. Connect via DBeaver

1.  **Open DBeaver**.
2.  Click on **Database** -> **New Database Connection**.
3.  Select **PostgreSQL** from the list.
4.  Enter the following settings:
    *   **Host**: `localhost`
    *   **Port**: `5435`
    *   **Database**: `focusflow`
    *   **Username**: `postgres`
    *   **Password**: `Panda@1501.1`
5.  Click **Test Connection** (you might need to download drivers if prompted).
6.  Click **Finish**.

> [!TIP]
> Once connected, you can see your tables under **Databases > focusflow > Schemas > public > Tables**.

## 3. Useful Docker Commands

*   `docker-compose stop`: Stops the database.
*   `docker-compose start`: Starts it again if it was stopped.
*   `docker-compose down`: Stops and removes the container (data is saved in the volume).
*   `docker-compose logs -f`: View the database logs.

