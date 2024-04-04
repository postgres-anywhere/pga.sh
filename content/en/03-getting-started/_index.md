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
curl -sfL https://pga.ongres.dev/pga.sh | sh -
```

This installs the `pga` binary, the Systemd service (`pga.service`) which will be enabled and running, as well as `pga-killall.sh` and `pga-uninstall.sh` scripts.

After this command has succeeded successfully, you should have a running PGA instance.
The command `pga info` gives you basic information about your PGA installation.

```
pga info 
```

You should see an output similar to the following:

```text {.no-copy-to-clipboard}
PGA 1.0

Client:
Version: 1.0
Daemon URL: http://localhost:54321

Daemon:
Version: 1.0
Listen address: 127.0.0.1
Port: 54321
Installation directory: /var/lib/pga
Clusters storage directory: /var/lib/pga/clusters
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
Cluster definition checked
Pulling image docker.io/library/postgres:15.3 ...
Pulled image docker.io/library/postgres:15.3
Postgres started, waiting for readiness ...
Cluster postgres started successfully
```

Now you can see your cluster in the list of all PGA clusters:

```
pga cluster list
```

Output:

```text {.no-copy-to-clipboard}
Name      Status    Version   Port      
postgres  Running   15.3      5432      
```

We can also list more details of our `postgres` cluster:

```
pga cluster get postgres
```

Output:

```text {.no-copy-to-clipboard}
PostgreSQL cluster:

Name:       postgres
Status:     Running
Postgres:   15.3
Flavor:     postgres
Port:       5432
```

Of course, you have the ability to change all the default option when creating a cluster via the `pga cluster create` command, and you can also create clusters from infrastructure-as-code definitions via YAML.
For more information on this, have a look at the [cluster management page]({{% relref "/04-cluster-management/" %}}) or the [create command reference]({{% relref "/05-command-reference/#create-cluster" %}}).

Now we see that our cluster is running, so let's try to access it.

## Access Cluster

With PGA, you don't need any Postgres-related tools installed on your system to open a SQL console to your Postgres instance.
The command `pga cluster psql` accesses Postgres via `psql` without requiring a prior installation of the `psql` tool:

```
pga cluster psql postgres
```

This opens up the `psql` console:

```text {.no-copy-to-clipboard}
psql (15.3 (Debian 15.3-1.pgdg120+1))
Type "help" for help.

postgres=#
```

Of course, you can still use your `psql` installation, or any other usual way to access Postgres.
PGA runs vanilla Postgres without any modifications, so you can access Postgres in any usual way.

Similarly, you can now point your applications to this Postgres instance (here we're running at the default port `5432`, so that's `localhost:5432`).
The Postgres superuser is `postgres` with password `postgres`.
Have a look at the `pga cluster create --help` usage or the [create command reference]({{% relref "/05-command-reference/#create-cluster" %}}) on how to modify these credentials.

## Stop cluster

We can stop and remove our cluster with the command `pga cluster stop`:

```
pga cluster stop postgres
```

Output:

```text {.no-copy-to-clipboard}
✓ The cluster postgres has been stopped and all its resources have been removed
```

This stops our cluster and removes all its data from our system.

## Uninstall PGA

You can uninstall PGA by invoking the `pga-uninstall.sh` command that has been created at installation time.
This stops all potentially running PGA Postgres clusters, removes the PGA installation and all created scripts and binaries, so that your system is in the exact same state as before you installed PGA.

```
pga-uninstall.sh
```