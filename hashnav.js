/*
 * Project: HashNav
 * Description: Organize function handlers for navigation by location hash
 * Author: Caio Rogerio http://github.com/caiorogerio
 * Verion: 0.1
 */
(function(){
	'use strict';

	function HashNav(handlers) {
		jQuery(window)
		// escuta o evento de alteração de hash
		.on('hashchange', function(evt){
			// regexp que trata hash da página (tirando # e / no inicio) e quebra em array
			var hash = location.hash.replace(/^#\/?/,'').split(/\//),
			// variável temporária para armazenar subitens do objeto de handlers
			handlersObj = handlers, 
			depth;

			function getArguments(depth) {
				var args = hash.slice( depth );
				return args.length === 1 && !args[0] ? [] : args;
			}

			// itera nos subitens do hash
			jQuery.each(hash, function(i, name) {	
				// verifica se o subitem existe no subnível corrente
				if( name in handlersObj ) {
					// dispara metodo default caso exista
					handlersObj.default && handlersObj.default.call && handlersObj.default.apply( this, getArguments( i ) );
					// navega no nível adentro desejado
					handlersObj = handlersObj[ name ];
					// grava profundidade encontrada em uma váriavel externa
					depth = i;
				}

				// caso o nível seja uma fuñção sai da iteração
				if( handlersObj.call ) return false;
			});

			if( handlersObj.default && handlersObj.default.call ) {
				handlersObj.default.apply( this, getArguments( depth + 1 ) );
			}	

			return handlersObj.call && handlersObj.apply( this, getArguments( depth + 1 ) );
		});

		jQuery(function(){
			jQuery(window).trigger('hashchange');
		});
	}
}