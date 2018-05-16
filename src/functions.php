<?php

if ( ! class_exists( 'Timber' ) ) {
	add_action( 'admin_notices', function() {
		echo '<div class="error"><p>Timber not activated. Make sure you activate the plugin in <a href="' . esc_url( admin_url( 'plugins.php#timber' ) ) . '">' . esc_url( admin_url( 'plugins.php') ) . '</a></p></div>';
	});

	add_filter('template_include', function($template) {
		return get_stylesheet_directory() . '/static/no-timber.html';
	});

  return;
}

Timber::$dirname = array('views', 'views/partials', 'views/layouts');

class SpottedSite extends TimberSite {
	function __construct() {
		show_admin_bar(false);

		add_theme_support( 'post-formats' );
		add_theme_support( 'post-thumbnails' );
		add_theme_support( 'menus' );
		add_theme_support( 'html5', array( 'comment-list', 'comment-form', 'search-form', 'gallery', 'caption' ) );

		remove_action( 'template_redirect', 'rest_output_link_header', 11, 0 );
		remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
		remove_action( 'wp_print_styles', 'print_emoji_styles' );
		remove_action( 'admin_print_styles', 'print_emoji_styles' );
		remove_action( 'wp_head', 'rest_output_link_wp_head' );
		remove_action( 'wp_head', 'wp_oembed_add_discovery_links' );
		remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
		remove_action( 'wp_head', 'wlwmanifest_link' );
		remove_action( 'wp_head', 'index_rel_link' );
		remove_action( 'wp_head', 'rsd_link' );
		remove_action( 'wp_head', 'wp_generator' );

		add_filter( 'timber_context', array( $this, 'add_to_context' ) );
		add_filter( 'get_twig', array( $this, 'add_to_twig' ) );
		add_filter( 'nav_menu_css_class', array( $this, 'special_nav_class' ), 10, 2 );
		add_filter( 'enter_title_here', array( $this, 'change_title_text' ) );

		add_action( 'init', array( $this, 'add_custom_options_page' ) );
		add_action('admin_head', array( $this, 'remove_add_media_buttons' ) );
		add_action( 'wp_footer', array( $this, 'deregister_scripts' ) );
		add_action( 'admin_head', array( $this, 'customize_page_meta_boxes' ) );


		parent::__construct();
	}

	function add_custom_options_page() {
		if ( function_exists('acf_add_options_page') ) {
			acf_add_options_page(array(
				'page_title' 	=> 'SEO',
				'menu_title'	=> 'SEO',
				'menu_slug' 	=> 'spotted_seo',
				'capability'	=> 'edit_posts',
				'icon_url'     => 'dashicons-search',
				'redirect'		=> false
			));
		}

		acf_add_options_page(array(
			'page_title'   => '404',
			'menu_title'   => '404',
			'menu_slug'    => 'spotted_not_found_page',
			'capability'   => 'edit_posts',
			'icon_url'     => 'dashicons-no',
			'redirect'     => false
		));

		acf_add_options_page(array(
			'page_title'   => 'Form Options',
			'menu_title'   => 'Form Options',
			'menu_slug'    => 'spotted_form_options',
			'capability'   => 'edit_posts',
			'icon_url'     => 'dashicons-feedback',
			'redirect'     => false
		));
	}

	function add_to_context( $context ) {
		$context['primary_nav'] = new TimberMenu('Primary Navigation');
		$context['footer_nav'] = new TimberMenu('Footer Navigation');
		$context['site'] = $this;
		$context['options'] = get_fields('option');
		return $context;
	}

	function add_to_twig( $twig ) {
		$twig->addExtension( new Twig_Extension_StringLoader() );
		$twig->addFilter('myfoo', new Twig_SimpleFilter('myfoo', array($this, 'myfoo')));
		return $twig;
	}

	function special_nav_class($classes, $item){
		if (
			in_array( 'current-menu-item', $classes ) ||
			in_array('current-menu-ancestor', $classes )
		) {
			$classes = array('current-menu-item');
		}

		return $classes;
	}

	function change_title_text( $title ){
		$screen = get_current_screen();

		if  ( 'testimonial' == $screen->post_type ) {
			$title = 'Enter testimonial attribution here';
		}

		return $title;
	}

	function deregister_scripts() {
 		wp_deregister_script( 'wp-embed' );
	}

	function customize_page_meta_boxes() {
		$slug = get_post_field( 'post_name' );

		remove_meta_box( 'postimagediv', 'page', 'side' );

		if ( 'home' == $slug || 'about' == $slug || 'platform' == $slug ) {
			remove_meta_box( 'pageparentdiv', 'page', 'side' );
		}

		echo '
			<style>
				label[for="parent_id"],
				select[name="parent_id"],
				label[for="menu_order"],
				input[name="menu_order"],
				input[name="menu_order"] + p {
					display: none;
				}
			</style>
		';
	}

	/* Remove add media buttons for all users */
	function remove_add_media_buttons() {
		remove_action( 'media_buttons', 'media_buttons' );
	}
}

new SpottedSite();
