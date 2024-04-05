---
title: "Cluster Management"
weight: 4
url: /cluster-management
description: How to manage PGA clusters
showToc: true
---

While PGA aims to offer the easiest getting-started experience, we have a myriad of options in creating and managing our clusters.

## Cluster Creation

### Command Line Options

The `pga cluster create` command offers a lot of options for configuration.
To get started, users are only required to set a unique name for their PGA cluster.
If there are multiple Postgres clusters running (via PGA or in general), one has to ensure that the network ports don't collide.

As an example, let's create three independent Postgres clusters, each running in a different version and on different ports:

```
pga cluster create -n postgres-16-2 -v 16.2 -p 5432
pga cluster create -n postgres-15-6 -v 15.6 -p 5431
pga cluster create -n postgres-15-5 -v 15.5 -p 5430
```

The option `-n` is short for `--name`, `-v` (`--version`) sets the Postgres version, and `-p` (`--port`) the network port.
Now we can see our Postgres clusters:

```
pga cluster list
```

Output:

```text {.no-copy-to-clipboard}
Name           Node       Primary   Status    Version   Port
postgres-15-5  archlinux  Primary   Running   15.5      5430
postgres-15-6  archlinux  Primary   Running   15.6      5431
postgres-16-2  archlinux  Primary   Running   16.2      5432
```

### Infrastructure as Code

It's also possible to create PGA clusters via YAML definitions, which is especially helpful to persist project or environment setups.

As an example, we can create a file `postgres-16-2.yaml` with the following contents:

```
name: 'postgres-16-2'
version: '16.2'
port: 5432
username: 'test'
password: 'test123'
```

The cluster is created via the `pga cluster create -f` option:

```
pga cluster create -f postgres-16-2.yaml
```

## Cluster Information

### Get Cluster Information

Besides listing the PGA clusters (via `pga cluster list`), it's possible to show the details of a specific cluster:

```
pga cluster get postgres-16-2
```

Output:

```text {.no-copy-to-clipboard}
PostgreSQL cluster:

Name:       postgres-16-2
Host:       archlinux
Primary:    Primary
Status:     Running
Postgres:   16.2
Flavor:     postgres
Port:       5432
```

Any information that is set at cluster creation time will be shown in the output.

### Cluster Life Cycle

When a cluster is created (`pga cluster create`), it is started immediately and will appear with status `Running`.

A cluster can be stopped, started, re-started (stop & start), and deleted.
During the life cycle of a running or stopped cluster, the cluster data (PGDATA, configuration, and logs) are stored persistently on disk and are accessible in your file system.
The data is fully deleted only at cluster deletion.

### Access Cluster Logs

The command `pga cluster logs` is used to display the log output of the running Postgres process:

```
pga cluster logs postgres-16-2
```

```text {.no-copy-to-clipboard}
[...]
2024-03-28 08:41:24.160 UTC [7] LOG:  starting PostgreSQL 16.2 (Debian 16.2-1.pgdg120+2) on x86_64-pc-linux-gnu, compiled by gcc (Debian 12.2.0-14) 12.2.0, 64-bit
2024-03-28 08:41:24.160 UTC [7] LOG:  listening on IPv4 address "0.0.0.0", port 5432
2024-03-28 08:41:24.160 UTC [7] LOG:  listening on IPv6 address "::", port 5432
2024-03-28 08:41:24.165 UTC [7] LOG:  listening on Unix socket "/var/run/postgresql/.s.PGSQL.5432"
2024-03-28 08:41:24.176 UTC [69] LOG:  database system was shut down at 2024-03-28 08:41:24 UTC
2024-03-28 08:41:24.182 UTC [7] LOG:  database system is ready to accept connections
```

The command can be used with or without the `-f` (`--follow`) option which when specified keeps the output open and streams new log lines as they arrive.

## Cluster Tags

PGA clusters can be tagged with key/value tags in order to add metadata.
The tags can then be used for filtering with certain PGA commands.

### Specify Tags

We can create a cluster with one or more tags either via command line arguments or YAML definitions.

```
pga cluster create -n postgres-16-2 -v 16.2 -p 5432 -t env=prod -t app=backend
pga cluster create -n postgres-15-6 -v 15.6 -p 5431 --tag env=test --tag app=backend
pga cluster create -n postgres-15-5 -v 15.5 -p 5430 --tag env=test,app=frontend
```

As we can see, we can specify multiple tags by either repeating the `-t` (or `--tag`) option, or by providing the tags in a comma-separated form.

Alternatively, we can define tags in our PGA cluster YAML definition as follows:

```
name: 'postgres-16-2'
version: '16.2'
port: 5432
tags:
  env: prod
  app: backend
```

### List Clusters by Tags

We can show the cluster tags in the `cluster list` command by adding the `--show-tags` option:

```
pga cluster list --show-tags
```

```text {.no-copy-to-clipboard}
Name           Node       Primary   Status    Version   Port      Tags      
postgres-15-5  archlinux  Primary   Running   15.5      5430      app=frontend, env=test
postgres-15-6  archlinux  Primary   Running   15.6      5431      app=backend, env=test
postgres-16-2  archlinux  Primary   Running   16.2      5432      app=backend, env=prod
```

We can filter that list by one or more tags:

```
pga cluster list --tag env=test
```

```text {.no-copy-to-clipboard}
Name           Node       Primary   Status    Version   Port      
postgres-15-5  archlinux  Primary   Running   15.5      5430      
postgres-15-6  archlinux  Primary   Running   15.6      5431      
```

```
pga cluster list -t env=test,app=backend --show-tags
```

```text {.no-copy-to-clipboard}
Name           Node       Primary   Status    Version   Port      Tags      
postgres-15-6  archlinux  Primary   Running   15.6      5431      app=backend, env=test
```

### Manage Clusters With Specific Tags

The cluster tags can be used in the `cluster stop` command, as well as `start`, `restart`, and `delete`.
The following shows the example of `cluster stop`:

```
pga cluster list --show-tags
```

```text {.no-copy-to-clipboard}
Name           Node       Primary   Status    Version   Port      Tags      
postgres-15-5  archlinux  Primary   Running   15.5      5430      app=frontend, env=test
postgres-15-6  archlinux  Primary   Running   15.6      5431      app=backend, env=test
postgres-16-2  archlinux  Primary   Running   16.2      5432      app=backend, env=prod
```

Now we stop all clusters tagged with `app=backend`:

```
pga cluster stop --tag app=backend
```

```text {.no-copy-to-clipboard}
✓ Clusters with tags (app=backend) have been stopped
```

In our example, only one cluster is left running:

```
pga cluster list --show-tags
```

```text {.no-copy-to-clipboard}
Name           Node       Primary   Status    Version   Port      Tags      
postgres-15-5  archlinux  Primary   Running   15.5      5430      app=frontend, env=test
postgres-15-6  archlinux  Primary   Stopped   15.6      5431      app=backend, env=test
postgres-16-2  archlinux  Primary   Stopped   16.2      5432      app=backend, env=prod
```

## Cluster Data

PGA clusters store the PGDATA directory on our computer's harddisk and mount them into the running Postgres instance.
At cluster creation time, this directory can be specified; otherwise, the directory resides under our default PGA installation (that is `/var/lib/pga/clusters/<cluster-name>/`).

At cluster deletion time, the directory is also removed.
When a cluster is stopped or restarted only, all data is kept persistently, for later usage.

The following example illustrates this:

```text {.no-copy-to-clipboard}
Name      Node       Primary   Status    Version   Port      
postgres  archlinux  Primary   Running   16.2      5432      
```

We can see the contents of our `postgres`' PGDATA directory.
If we didn't specify an alternative path, this directory resides under `/var/lib/pga/clusters/postgres/`

```
ls -hl /var/lib/pga/clusters/postgres/
```

```text {.no-copy-to-clipboard}
total 8.0K
drwxr-xr-x  2 root root 4.0K Apr  5 08:59 logs
drwx------ 19 999  root 4.0K Mar 23 08:51 pgdata
```

When stopping our cluster, this directory still exists:

```
pga cluster stop postgres
```

```text {.no-copy-to-clipboard}
✓ The cluster postgres has been stopped
```

The `clusters/postgres/` directory still exists:

```
ls -hl /var/lib/pga/clusters/postgres/
```

```text {.no-copy-to-clipboard}
total 8.0K
drwxr-xr-x  2 root root 4.0K Apr  5 08:59 logs
drwx------ 19 999  root 4.0K Mar 23 08:51 pgdata
```

If we re-start the `postgres` PGA cluster, the contents of this data directory will be used again.
Only at cluster deletion time will this directory be removed.

## Cluster Deletion

PGA clusters can be stopped and fully removed with the `cluster delete` command.
Just like for the `start`, `restart`, and `stop` command, we have the possibility to specify a single cluster by name, all clusters, or clusters with certain tags.

Given the following clusters:

```text {.no-copy-to-clipboard}
Name           Status    Version   Port      Tags      
postgres-15-5  archlinux  Primary   Running   15.5      5430      app=frontend, env=test
postgres-15-6  archlinux  Primary   Stopped   15.6      5431      app=backend, env=test
postgres-16-2  archlinux  Primary   Stopped   16.2      5432      app=backend, env=prod
```

This command would delete only the `postgres-15-5` cluster:

```
pga cluster delete postgres-15-5
```

This command would delete all clusters tagged with `app=backend` (`postgres-16-2` and `postgres-15-6`):

```
pga cluster delete --tag app=backend
```

And this command can be used to delete all clusters:

```
pga cluster delete --all
```

Since the cluster deletion is an irrecoverable action that will remove our data, we have to confirm on the command line (or bypass the confirmation with the option `-f` / `--force`):

```text {.no-copy-to-clipboard}
$> pga cluster delete --all
This will delete all data of the clusters (including the PGDATA directories and PostgreSQL config)
To confirm type delete and press Enter: delete
✓ All clusters have been deleted
```