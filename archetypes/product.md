---
# This is a sellable product template.
title: "{{ replace .TranslationBaseName "-" " " | title }}"
reference: "000-000"
# Use aliases for old part numbers: https://gohugo.io/content-management/urls/#aliases/
date: {{ .Date }}
sellable: false
draft: true
---
