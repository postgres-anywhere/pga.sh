---
title: "Custom Installation"
weight: 1
url: /install/custom
description: Details about how to customize the PGA installation to fit your needs.
---

It's possible to modify the installation paths, as well as the PGA daemon's port and listen address.
For this, we make use of the configuration options described below.

The recommended way is to set the configuration options at installation time:

```
curl -sfL https://pga.sh/install | INSTALL_PGA_DIR=/my/path/pga PGA_DAEMON_PORT=54322 [...] sh - 
```

## Configuration Options

Environment variables starting with `INSTALL_PGA*` are only relevant during installation time.
The name and file paths should not be changed after the installation.

- `INSTALL_PGA_NAME`:
  The name of the PGA installation, from will the default directories,
  service names, and binaries are derived. This changes all following options
  that contain the default PGA name. Default: `pga`

- `INSTALL_PGA_DIR`:
  The directory to install PGA, config files, and required dependencies to (default: `/var/lib/pga`).

- `INSTALL_PGA_BIN_DIR`:
  The directory to install PGA binary, links, and uninstall script to (default: `/usr/local/bin`).

- `INSTALL_PGA_RUN_DIR`:
  The directory to where PGA run files are located (default: `/var/run/pga`).

- `INSTALL_PGA_SYSTEMD_DIR`:
  The directory to install systemd service files to (default: `/etc/systemd/system`).

- `INSTALL_PGA_SYSTEMD_NAME`:
  The name of the systemd service to create. If not specified it will default from the PGA name.

- `INSTALL_PGA_CREATE_DEFAULT_CLUSTER`:
  If set to `true` the installation will create and start a default cluster with the latest Postgres version.


The following environment variables configure the PGA daemon and client setup.
These variables are configured in the PGA's config file, by default located at `/var/lib/pga/.env`.
Some of the options can be changed after installation, by modifying the config file and restarting PGA (e.g. via Systemd).

- `PGA_DAEMON_PORT`:
  The port that the PGA listens to (default: `54321`).
- `PGA_DAEMON_LISTEN`:
  The IP address that the PGA listens to (default: `127.0.0.1`).
  This can be changed (e.g. to `0.0.0.0`) if the daemon should be reachable via a network or from outside localhost.
- `PGA_DAEMON_URL`:
  The URL of the PGA daemon that the CLI client connects to (default: `http://localhost:<pga-daemon-port>`).
  This only needs to be changed if the CLI should connect to a different host or port.
- `PGA_CLUSTERS_PATH`:
  This configures where the PostgreSQL data is stored (default: the installation directory (`/var/lib/pga`) under sub-directory `clusters/`).
  *NOTE:* This should be set at installation time and not changed later.

If these environment variables are specified at installation time, they will be persisted in the PGA configuration file.


## Multiple PGA Instances

While there might be only very few cases in which this makes sense, it's possible to install and run multiple PGA instances simultaneously.

For this, you need to ensure that the installations don't collide with each other, with regard to directories, configuration, and system units.
The easiest way to ensure this is to set a different name (`INSTALL_PGA_NAME`, default: `pga`), which affects the cli commands and paths, as well as the port on which the daemon listens (`PGA_DAEMON_PORT`).

```
# this will install a PGA installation that doesn't collide with a second one installed with the default options
curl -sfL https://pga.sh/install | INSTALL_PGA_NAME=pga2 PGA_DAEMON_PORT=54322 sh - 
```

You can also set individual installation options to your choice (see the lists above).
