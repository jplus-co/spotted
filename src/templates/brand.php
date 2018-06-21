<?php

/* Template Name: Brand Template */

$context = Timber::get_context();
$context['post'] = new TimberPost();

Timber::render('brand-template.twig', $context);
