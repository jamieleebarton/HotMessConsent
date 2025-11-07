package com.example.hotmessnda.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.ColorScheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val DarkColors = darkColorScheme(
    primary = Color(0xFFFF4C6A),
    onPrimary = Color.White,
    background = Color(0xFF121212),
    onBackground = Color.White
)

@Composable
fun HotMessTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colors: ColorScheme = DarkColors
    MaterialTheme(
        colorScheme = colors,
        typography = Typography,
        content = content
    )
}

