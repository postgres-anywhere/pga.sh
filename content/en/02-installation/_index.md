---
title: "Installation"
weight: 2
url: /install
description: Details about how to install PGA.
---

Install PGA with the following command:

```
curl -sfL https://pga.ongres.dev/pga.sh | sh -
```

This installs the `pga` binary, the Systemd service (`pga.service`) which will be enabled and running, as well as `pga-killall.sh` and `pga-uninstall.sh` scripts.

For custom installation options and more information, see [custom installation]({{% relref "/02-installation/01-custom-installation" %}}).

## Uninstall

To uninstall, you can invoke the `pga-uninstall.sh` script, which stops and removes all PGA resources, uninstalls PGA, and removes all PGA-related files (including the `pga-uninstall.sh` script itself).