---
title: "Command Reference"
weight: 5
url: /command-reference
description: The reference of the PGA command
showToc: true
---

The PGA command (`pga`) contains all PGA-related functionality, from running the daemon, showing PGA-relevant information, to managing the PGA clusters.

In the command line, you can quickly list the possible sub-commands and options with the global `--help` (or `-h`) option:

```text {.no-copy-to-clipboard}
$> pga
Please specify a subcommand or run the daemon with --server
Usage: pga [-hX] [--server] [COMMAND]
Manages PostgreSQL (Postgres Anywhere)
  -h, --help
      --server   Starts the server process
  -X, --debug    Prints debug and error stacktrace information
Commands:
  cluster    Manages PostgreSQL clusters (Postgres Anywhere)
  extension  Manages PostgreSQL extensions
  info       Displays information about the PGA installation
```

This `--help` option works for all sub-commands and offers a quick reference:

```text {.no-copy-to-clipboard}
$> pga cluster --help
Usage: pga cluster [-hX] [COMMAND]
Manages PostgreSQL clusters (Postgres Anywhere)
  -h, --help
  -X, --debug   Prints debug and error stacktrace information
Commands:
  get     Get a PostgreSQL clusters by its name
  list    Lists the PostgreSQL clusters
  create  Creates a PostgreSQL cluster
  stop    Stops one or more PostgreSQL clusters and removes their resources
  exec    Executes a command in a running PostgreSQL instance (i.e. the
            container)
  psql    Opens a psql terminal to a running PostgreSQL cluster.
```

## PGA Installation Info

The command `pga info` retrieves information about your PGA installation.

#### Examples

```text {.no-copy-to-clipboard}
$> pga info
PGA 1.0-SNAPSHOT

Client:
Version: 1.0-SNAPSHOT
Daemon URL: http://localhost:54321

Daemon:
Version: 1.0-SNAPSHOT
Listen address: 127.0.0.1
Port: 54321
Installation directory: /var/lib/pga
Clusters storage directory: /var/lib/pga/clusters
Containerd version: 1.7.3
Containerd socket: /var/run/pga/containerd/containerd.sock
System service file: /etc/systemd/system/pga.service
```

## Cluster Management Commands

The command `pga cluster` manages the PGA clusters.

### List Clusters

The command `pga cluster list` lists all running Postgres clusters on your system.

#### Usage

```text {.no-copy-to-clipboard}
$> pga cluster list --help
Usage: pga cluster list [-h] [--show-tags] [-t=<key=value>]...
Lists the PostgreSQL clusters
  -h, --help
      --show-tags         Shows the cluster tags in the list
  -t, --tag=<key=value>   Only list clusters that are tagged accordingly
```

#### Examples

```text {.no-copy-to-clipboard}
$> pga cluster list
PostgreSQL clusters:
Name           Status    Version   Port
postgres-16-2  Running   16.2      5432
postgres-15-6  Running   15.6      5431
postgres-15-5  Running   15.5      5430
```

The option `--show-tags` will include the optional tags that have been set at cluster creation time:

```text {.no-copy-to-clipboard}
$> pga cluster list --show-tags
PostgreSQL clusters:
Name           Status   Version  Port  Tags
postgres-16-2  Running  16.2     5432  env=prod, app=backend
postgres-15-6  Running  15.6     5431  app=backend
postgres-15-5  Running  15.5     5430
```

The option `-t` (`--tag`) lists only clusters that have been tagged with the given tag(s).
If multiple tags are stated in the filter, only clusters that match all these tags are listed.

```text {.no-copy-to-clipboard}
$> pga cluster list -t app=backend
Name           Status   Version  Port
postgres-16-2  Running  16.2     5432
postgres-15-6  Running  15.6     5431
```

It's possible to state multiple tags either as multiple `-t`/`--tag` options, or by combining them as comma-separated values, such as: `-t env=prod,app=backend`

```text {.no-copy-to-clipboard}
$> pga cluster list -t app=backend -t env=prod --show-tags
Name           Status   Version  Port  Tags
postgres-16-2  Running  16.2     5432  env=prod, app=backend
```

### Get Cluster

The command `pga cluster get` retrieves information about a single Postgres cluster.

#### Usage

```text {.no-copy-to-clipboard}
$> pga cluster get --help
Usage: pga cluster get [-h] <name>
Get a PostgreSQL clusters by its name
      <name>   The cluster name
  -h, --help
```

#### Examples

The following command retrieves information about a cluster named `postgres`:

```text {.no-copy-to-clipboard}
$> pga cluster get postgres
PostgreSQL cluster:

Name:      postgres
Status:    Running
Postgres:  15.3
Flavor:    postgres
Port:      5432
Tags:      app=backend, env=prod
```

### Create Cluster

The command `pga cluster create` creates a Postgres cluster.

#### Usage

```text {.no-copy-to-clipboard}
$> pga cluster create --help
Usage: pga cluster create [-h] [-f=<file>] [-F=<flavor>] [-n=<name>] [-p=<port>] [-P=<password>] [--pgdata=<path>] [-u=<username>] [-v=<version>]
                                  [-e=<extension> [,<extension>...]]... [-t=<key=value>]...
Creates a PostgreSQL cluster
  -e, --extensions=<extension>[,<extension>...]
                            The PostgreSQL extensions (comma-separated extension names)
  -f, --file=<file>         A YAML file containing a PostgreSQL cluster definition (overrides other options)
  -F, --flavor=<flavor>     The PostgreSQL flavor (postgres, babelfish; default: 'postgres')
  -h, --help
  -n, --name=<name>         The cluster name
  -p, --port=<port>         The port of the PostgreSQL cluster (default: 5432). Specifying 0 will randomly choose a free port.
  -P, --password=<password> The password of the superuser (default: postgres)
      --pgdata=<path>       The host path to mount PGDATA into PostgreSQL
  -t, --tag=<key=value>     A tag (key/value pair) to add to the cluster
  -u, --username=<username> The name of the superuser (default: postgres)
  -v, --version=<version>   The PostgreSQL version (default: 15.3)
```

#### Examples

The following shows a minimal example how to create a Postgres cluster.
At the very least, the cluster name has to be defined:

```text {.no-copy-to-clipboard}
$> pga cluster create -n postgres
✓ Creating PostgreSQL cluster
Cluster definition checked
Pulling image docker.io/library/postgres:15.3 ...
Pulled image docker.io/library/postgres:15.3
Postgres started, waiting for readiness ...
Cluster postgres started successfully
```

...

```text {.no-copy-to-clipboard}
$> pga cluster create -n postgres -t env=prod,app=backend
✓ Creating PostgreSQL cluster
Cluster definition checked
Pulling image docker.io/library/postgres:15.3 ...
Pulled image docker.io/library/postgres:15.3
Postgres started, waiting for readiness ...
Cluster postgres started successfully
```

### Stop &amp; Remove Cluster

The command `pga cluster stop` stops a running Postgres cluster and removes all of its resources.

#### Usage

```text {.no-copy-to-clipboard}
$> pga cluster stop --help
Usage: pga cluster stop [-h] [--keep-pgdata] (<name> | --all | -t=<key=value>)
Stops one or more PostgreSQL clusters and removes their resources
     [<name>]             The cluster name
     --all                Stop all clusters
  -h, --help
      --keep-pgdata       Doesn't delete the PGDATA directory on the host
  -t, --tag=<key=value>   Only stop clusters that are tagged accordingly
Either of <name>, --all, or --tag is required
```

#### Examples

```text {.no-copy-to-clipboard}
$> pga cluster stop postgres
✓ The cluster postgres has been stopped and all its resources have been removed
```

### Exec In Cluster

The command `pga cluster exec` executes a command in a running Postgres instance, that is in the container that runs Postgres.
This is comparable to the `exec` command of container runtimes, such as Docker or Podman.

#### Usage

```text {.no-copy-to-clipboard}
$> pga cluster exec --help
Usage: pga cluster exec [-h] <name> [--] <command/args>...
Executes a command in a running PostgreSQL instance (i.e. the container)
      <name>              The cluster name
      <command/args>...   The command and optional arguments
  -h, --help
  --                      This option separates PGA options from the command and args sent to the execute command.
```

#### Examples

```text {.no-copy-to-clipboard}
$> pga cluster exec postgres -- echo hello world
hello world

$> pga cluster exec postgres -- ls
bin   docker-entrypoint-initdb.d  lib    libx32  opt   run   sys  var
boot  etc                         lib32  media   proc  sbin  tmp
dev   home                        lib64  mnt     root  srv   usr

$> pga cluster exec postgres -- bash
root@hostname:/# 
```

It's possible to use `pga cluster exec` to open a terminal inside the running Postgres environment, i.e. the container.

### Open Psql In Cluster

The command `pga cluster psql` executes `psql` in a running Postgres instance.
This is a shortcut for `pga cluster exec` using `psql`.

#### Usage

```text {.no-copy-to-clipboard}
$> pga cluster psql --help
Usage: pga cluster psql [--help] <name>
Opens a psql terminal to a running PostgreSQL cluster.
      <name>   The cluster name
      --help
This command uses the known connection information, such as superuser/password
that was provided at cluster creation time. This is a shortcut
for: `cluster exec <name> -- psql -U <superuser>`.
```

#### Examples

```text {.no-copy-to-clipboard}
$> pga cluster psql postgres
psql (15.3 (Debian 15.3-1.pgdg120+1))
Type "help" for help.

postgres=#
```

### Get Cluster Logs

The command `pga cluster logs` prints the logs of the running Postgres instance.

#### Usage

```text {.no-copy-to-clipboard}
$> pga cluster logs --help
Usage: pga cluster logs [-fh] <name>
Prints the logs of a running PostgreSQL instance
      <name>     The cluster name
  -f, --follow   Stream the logs
  -h, --help
```

#### Examples

```text {.no-copy-to-clipboard}
$> pga cluster logs postgres
[...]
2024-03-28T09:51:58.703867007+01:00 stderr F 2024-03-28 08:51:58.703 UTC [7] LOG:  starting PostgreSQL 15.3 (Debian 15.3-1.pgdg120+1) on x86_64-pc-linux-gnu, [...]
2024-03-28T09:51:58.703875953+01:00 stderr F 2024-03-28 08:51:58.703 UTC [7] LOG:  listening on IPv4 address "0.0.0.0", port 5432
2024-03-28T09:51:58.703878158+01:00 stderr F 2024-03-28 08:51:58.703 UTC [7] LOG:  listening on IPv6 address "::", port 5432
2024-03-28T09:51:58.709749772+01:00 stderr F 2024-03-28 08:51:58.709 UTC [7] LOG:  listening on Unix socket "/var/run/postgresql/.s.PGSQL.5432"
2024-03-28T09:51:58.717379132+01:00 stderr F 2024-03-28 08:51:58.717 UTC [69] LOG:  database system was shut down at 2024-03-28 08:51:58 UTC
2024-03-28T09:51:58.722459617+01:00 stderr F 2024-03-28 08:51:58.722 UTC [7] LOG:  database system is ready to accept connections
```


## Cluster Metadata Commands

### List Extensions

The command `pga extension list` lists all available Postgres extensions that can be used at cluster creation time.

#### Usage

```text {.no-copy-to-clipboard}
$> pga extension list --help
Usage: pga extension list [-h]
Lists the names of the available extensions
  -h, --help
```

#### Examples

```text {.no-copy-to-clipboard}
$> pga extension list 
adminpack
amcheck
bloom
[...]
```

## PGA Daemon

You start the daemon process in the following way.
*NOTE:* This is usually included in a daemon startup file such as Systemd. It also needs root permissions.

```text {.no-copy-to-clipboard}
pga --server
```

The command reads the configuration from a file `.env` residing in the installation directory, created at install time.
Optionally, you can specify the containerd socket via parameter.

```text {.no-copy-to-clipboard}
pga -Dpga.cri.socket.path=</path/to/containerd.sock> --server
```
