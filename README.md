# check-sites
Checking the list of sites for availability and availability of cloudflare captcha
## Installation
```
./install.sh
```
## Usage
```
check-sites [-h] [-a FILENAME] [-c FILENAME] -i FILENAME
```
### Optional arguments
- `-a FILENAME, --available FILENAME`\
  Specifies a output file with a list of available sites
- `-c FILENAME, --captcha FILENAME`\
  Specifies a output file with a list of sites that doesn't have a cloudflare captcha
### Required arguments
- `-i FILENAME, --input FILENAME`\
  Specifies a input file with a list of sites
