<?php

/* Template Name: Reports Template */

$context = Timber::get_context();
$context['post'] = new TimberPost();

Timber::render('reports-template.twig', $context);
