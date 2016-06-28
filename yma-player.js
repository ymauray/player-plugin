(function($) {

    'use strict';

    $(document).ready(function() {

        var audios = $('.yma_player audio');
        audios.on('play', function(event) {
            var target = event.target;
            var id = $(target).attr('data-player-id');
            var player = $('#yma_player_' + id);
        });

        audios.on('pause', function(a, b, c, d, e, f) {
            
        });

        audios.on('timeupdate', function(event) {
            var target = event.target;
            var id = $(target).attr('data-player-id');
            var player = $('#yma_player_' + id);
            if (target.duration > 0) {
                var advance = 100 * target.currentTime / target.duration;
                $('.yma_player_progress_bar', player).css('width', advance + '%');
            }
            var options = $('datalist option', player);
            for (var i = options.length - 1; i >= 0; i--) {
                var option = options[i];
                var index = $(option).attr('data-index');
                if (index < target.currentTime) {
                    var title = $(option).val();
                    var performer = $(option).attr('data-performer');
                    $('.yma_player_artist', player).text(performer).removeClass('single');
                    $('.yma_player_title', player).text(title);
                    break;
                }
            }
        });

        $('.yma_player_background_bar').click(function(event) {
            var player_id = $(this).attr('data-player-id');
            var audio = $('audio#yma_player_audio_' + player_id)[0];
            var width = event.target.offsetWidth;
            var position = event.offsetX;
            var percent = position / width;
            audio.currentTime = audio.duration * percent;
        });

        $('.yma_player_progress_bar').click(function(event) {
            var player_id = $(this).attr('data-player-id');
            var audio = $('audio#yma_player_audio_' + player_id)[0];
            var width = event.target.offsetWidth;
            var position = event.offsetX;
            var percent = position / width;
            audio.currentTime = audio.currentTime * percent;
        });

        $('.yma_player_play_button').click(function(event) {
            event.preventDefault();
            var play_circle = $('.fa-play-circle', $(this));
            var player_id = $(this).attr('data-player-id');
            var audio = $('audio#yma_player_audio_' + player_id)[0];
            $('.fa', $(this)).toggleClass('fa-play-circle');
            $('.fa', $(this)).toggleClass('fa-pause-circle');
            if (play_circle.length == 1) {
                audio.play();
            } else {
                audio.pause();
            }
        });

        var volume_bars = $('.yma_player_volume_bar');
        volume_bars.each(function(index, item) {
            var bar_height = this.offsetHeight;
            var button = $('.yma_player_volume_button', this);
            var button_height = button[0].offsetHeight;
            var top = (bar_height * .75) - (button_height / 2);
            button.css('bottom', top + 'px');
            button.show();
        });

        volume_bars.click(function(event) {
            console.log(event.offsetY);
            console.log(event.target.offsetHeight);
        });
    });
    
}(window.jQuery));