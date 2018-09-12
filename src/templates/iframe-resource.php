<?php

/* Template Name: Iframe Resource Template */

$context = Timber::get_context();
$context['post'] = new TimberPost();

Timber::render('iframe-resource-template.twig', $context);