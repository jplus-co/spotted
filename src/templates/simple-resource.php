<?php

/* Template Name: Simple Resource Template */

$context = Timber::get_context();
$context['post'] = new TimberPost();

Timber::render('simple-resource-template.twig', $context);