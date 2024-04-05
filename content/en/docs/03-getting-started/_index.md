---
title: "Getting Started"
weight: 3
url: /getting-started
description: How to get started with PGA
---

This page shows you how to get started with PGA and how to set up a Postgres cluster in a matter of seconds.

## Install PGA

Install PGA with the following command:

```
curl -sfL https://pga.sh/install | sh -
```

This installs the `pga` binary, the Systemd service (`pga.service`) which will be enabled and running, as well as `pga-killall.sh` and `pga-uninstall.sh` scripts.

After this command has succeeded successfully, you should have a running PGA instance.
The command `pga info` gives you basic information about your PGA installation.

```
pga info 
```

You should see an output similar to the following:

```text {.no-copy-to-clipboard}
PGA 0.1

Client:
Version: 0.1
Daemon URL: http://localhost:54321

Daemon:
Version: 0.1
Listen address: 127.0.0.1
Port: 54321
Installation directory: /var/lib/pga
Default cluster storage: /var/lib/pga/clusters
Containerd version: 1.7.3
Containerd socket: /var/run/pga/containerd/containerd.sock
System service file: /etc/systemd/system/pga.service
```

## Create Postgres Cluster

You create your first PGA Postgres cluster with the `pga cluster create` command:

```
pga cluster create --name postgres
```

You should see an output similar to the following:

```text {.no-copy-to-clipboard}
✓ Creating PostgreSQL cluster
Downloading Postgres image 16.2
Image downloaded
Postgres started, waiting for readiness ...
Cluster postgres started successfully

Connect to your cluster with the following command: pga cluster psql postgres
Generate or write your ~/.pgpass or ~/.pg_service.conf with: pga cluster config write postgres
View more information about your cluster with: pga cluster get postgres
```

Now you can see your cluster in the list of all PGA clusters:

```
pga cluster list
```

Output:

```text {.no-copy-to-clipboard}
Name      Node       Primary   Status    Version   Port      
postgres  archlinux  Primary   Running   16.2      5432      
```

We can also list more details of our `postgres` cluster:

```
pga cluster get postgres
```

Output:

```text {.no-copy-to-clipboard}
PostgreSQL cluster:

Name:       postgres
Host:       archlinux
Primary:    Primary
Status:     Running
Postgres:   16.2
Flavor:     postgres
Port:       5432
```

Of course, you have the ability to change all the default option when creating a cluster via the `pga cluster create` command, and you can also create clusters from infrastructure-as-code definitions via YAML.
For more information on this, have a look at the [cluster management page]({{% relref "/docs/04-cluster-management/" %}}) or the [create command reference]({{% relref "/docs/05-command-reference/#create-cluster" %}}).

Now we see that our cluster is running, so let's try to access it.

## Access Cluster

With PGA, you don't need any Postgres-related tools installed on your system to open a SQL console to your Postgres instance.
The command `pga cluster psql` accesses Postgres via `psql` without requiring a prior installation of the `psql` tool:

```
pga cluster psql postgres
```

This opens up the `psql` console:

```text {.no-copy-to-clipboard}
psql (16.2 (Debian 16.2-1.pgdg120+2))
Type "help" for help.

postgres=#
```

Of course, you can still use your `psql` installation, or any other usual way to access Postgres.
PGA runs vanilla Postgres without any modifications, so you can access Postgres in any usual way.

Similarly, you can now point your applications to this Postgres instance (here we're running at the default port `5432`, so that's `localhost:5432`).
The Postgres superuser is `postgres` with password `postgres`.
Have a look at the `pga cluster create --help` usage or the [create command reference]({{% relref "/docs/05-command-reference/#create-cluster" %}}) on how to modify these credentials.

## Stop cluster

We can stop our cluster with the command `pga cluster stop`:

```
pga cluster stop postgres
```

Output:

```text {.no-copy-to-clipboard}
✓ The cluster postgres has been stopped
```

Output of `pga cluster list`:

```text {.no-copy-to-clipboard}
Name      Node       Primary   Status    Version   Port      
postgres  archlinux  Primary   Stopped   16.2      5432      
```

This stops our cluster.
All its data and configuration is still stored on our system.

We could start the cluster again `pga cluster start postgres` or fully delete it:

```
pga cluster delete postgres
```

```text {.no-copy-to-clipboard}
This will delete all data of the postgres cluster (including the PGDATA directory and PostgreSQL config)
To confirm type delete and press Enter: delete
✓ The cluster postgres has been deleted
```

The deletion is an irrecoverable action that will delete our data, and therefore we have to confirm on the command line (or bypass the confirmation with the option `-f` / `--force`).

Now our Postgres cluster is fully gone as we can see in the output of `pga cluster list`:

```text {.no-copy-to-clipboard}
There are no PostgreSQL clusters running
```


## Uninstall PGA

You can uninstall PGA by invoking the `pga-uninstall.sh` command that has been created at installation time.
This stops all potentially running PGA Postgres clusters, removes the PGA installation and all created scripts and binaries, so that your system is in the exact same state as before you installed PGA.

```
pga-uninstall.sh
```