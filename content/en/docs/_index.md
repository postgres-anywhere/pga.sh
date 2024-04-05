---
title: "Documentation"
url: /docs
weight: 0
---

> PGA -- Postgres Anywhere. The easiest way to install and run PostgreSQL.

The motivation behind *Postgres Anywhere* (PGA) is to enable engineers to start, host, and manage PostgreSQL with the best experience possible.

PGA offers a blazing-fast getting-started experience, enables you to have multiple major and minor versions of Postgres running at the same time, and manages your Postgres instances without compromising your existing system configuration.

## PGA In Action

<img src="/images/docs/pga-cli-cluster.gif" class="inline featherlight-image" alt="PGA command line example">

<!--
```
$> pga cluster list
There are no PostgreSQL clusters running

$> pga cluster create --name test
✓ Creating PostgreSQL cluster
Cluster definition checked
Pulling image docker.io/library/postgres:15.3 ...
Pulled image docker.io/library/postgres:15.3
Postgres started, waiting for readiness ...
Cluster test started successfully

$> pga cluster get test
PostgreSQL cluster:

Name:       test
Status:     Running
Postgres:   15.3
Port:       5432

$> pga cluster psql test
psql (15.3 (Debian 15.3-1.pgdg120+1))
Type "help" for help.

postgres=#
```
-->

See a detailed list of [PGA features]({{% relref "/docs/01-what-is-pga/01-features" %}}).

## Install

Install PGA with the following command:

```
curl -sfL https://pga.sh/install | sh -
```

See more information about the [installation]({{% relref "/docs/02-installation" %}}).