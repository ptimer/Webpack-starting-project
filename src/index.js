import * as $ from 'jquery'
import App from '@components/App.js'
import '@styles/App.scss'

var counter = 0

$('#jsWorks').click(_ => {
	counter += 1
	$('h2').html(`Counter ${counter}`)
	counter > 5 ? $('.app').html(App({text: 'Dont click too much buddy'})) : null
})