# Custom Domain Configuration Guide

This guide explains how to connect a custom domain to your Image Gallery application deployed on the Internet Computer.

## Overview

The Internet Computer supports custom domains through its boundary nodes. This allows you to serve your application from your own domain (e.g., `gallery.example.com`) instead of the default `.ic0.app` or `.raw.ic0.app` URLs.

## Prerequisites

- A deployed canister on the Internet Computer mainnet
- A domain name you control
- Access to your domain's DNS settings

## Step 1: Configure DNS

Add a CNAME record pointing your domain to the IC boundary node:

