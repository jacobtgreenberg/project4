var socket = io();

$(() => { 

            const user = $('.state').attr('id')
    
            const messages = $('#messages')
            const form = $('#form')
            const input = $('#input')
    
            form.on('submit', function(e) {
                e.preventDefault();
                if (input.val()) {
                    socket.emit('chat message', user + ': ' + input.val())
                    input.val('');
                }
            })
    
            socket.on('chat message', function(msg) {
                const item = $('<li>').attr('id','chatli')
                item.text(msg)
                messages.append(item)
                messages.scrollTop(item.offset().top)
            })

            $('#chat-x').on('dblclick', ()=>{ 
                $('#chat-div').css('display','initial')
                $('#chat-x').css('display','none')
            } )

            $('#chat-div').on('dblclick', ()=>{
                $('#chat-div').css('display','none')
                $('#chat-x').css('display','initial')
            } )



})